import { JsonRpcProvider } from "@ethersproject/providers";
import { TRPCError } from "@trpc/server";
import { Contract, type ContractFunction } from "ethers";
import { z } from "zod";
import { getErrorMsg } from "~/data/error-list";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { ZodAvailableNetworks } from "~/types/web3";
import { getNetworkArray } from "~/utils/type_helper";
import * as pvtRPCs from "~/web3/rpcs/private-rpcs.json";

export const web3Router = createTRPCRouter({
  shoutOut: privateProcedure
    .input(z.object({ collectionAddress: z.string(), msg: z.string().max(181) }))
    .mutation(async ({ input, ctx }) => {
      const { collectionAddress, msg } = input;
      const { address: userAddress } = ctx.session;
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          address: collectionAddress,
        },
        select: {
          owner_address: true,
        },
      });
      if (!collection) {
        return { success: false, msg: getErrorMsg("sww") };
      }
      if (collection.owner_address !== userAddress) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      try {
        await ctx.prisma.message.create({
          data: {
            collection_address: collectionAddress,
            content: msg,
          },
        });
        return { success: true, msg: "shout out was successful!" };
      } catch {
        return { success: false, msg: getErrorMsg("sww") };
      }
    }),
  addHolder: privateProcedure
    .input(z.object({ collectionAddress: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userAddress = ctx.session.address;
      const { collectionAddress } = input;

      // the execution is based on the depth of the queries
      // check if the collection is registered
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          address: collectionAddress,
        },
        select: {
          networks: true,
        },
      });
      if (!collection) {
        return { success: false, msg: "collection not available or registered" };
      }

      // users availabilty is checked before without using an upsert operation because rpc call are far more
      // expensive than a single db read

      // adding the collection to the users holding if not added
      const alreadyIn = await ctx.prisma.userHolds.findUnique({
        where: {
          holder_address_collection_address: { holder_address: userAddress, collection_address: collectionAddress },
        },
        select: {
          holder_address: true,
        },
      });
      if (alreadyIn) {
        return { success: false, msg: "already registered as a holder" };
      }

      // checking if the user is a holder of the Contract
      const jsonObj = JSON.parse(collection.networks) as { chains: string[] | undefined };
      const providedNetworks = getNetworkArray(jsonObj.chains);
      if (!providedNetworks[0]) {
        return { success: false, msg: "no network found" };
      }
      const provider = new JsonRpcProvider(pvtRPCs[providedNetworks[0]]);
      const contract = new Contract(collectionAddress, [
        "function balanceOf(address _owner) external view returns (uint256)",
      ], provider);
      try {
        const staticContract = contract.callStatic as {
          balanceOf: ContractFunction<number | undefined>;
        };
        const balance = await staticContract.balanceOf(userAddress);
        if (!balance) {
          return { success: false, msg: getErrorMsg("sww") };
        }
        if (balance < 1) {
          return { success: false, msg: "you are not a holder of this collection" };
        }
      } catch {
        return { success: false, msg: "trouble calling to the contract" };
      }

      // adding the collection to the users holding if not added
      try {
        await ctx.prisma.userHolds.upsert({
          where: {
            holder_address_collection_address: { holder_address: userAddress, collection_address: collectionAddress },
          },

          create: {
            collection_address: collectionAddress,
            holder_address: userAddress,
          },
          update: {},
        });
        return { success: true, msg: "collection added to holdings successfully" };
      } catch {
        return { success: false, msg: "attempt failed" };
      }
    }),

  addCollection: privateProcedure
    .input(z.object({ collectionAddress: z.string(), networks: z.array(ZodAvailableNetworks).min(1) }))
    .mutation(async ({ input, ctx }) => {
      // get user address from the session
      const { address: userAddress } = ctx.session;
      const { collectionAddress, networks } = input;

      if (!networks[0]) {
        return { success: false, msg: "invalid argument" };
      }

      // users availabilty is checked before without using an upsert operation because rpc call are far more
      // expensive than a single db read

      // check if the collection is registered
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          address: collectionAddress,
        },
        select: {
          owner_address: true,
        },
      });
      if (collection) {
        return { success: false, msg: "collection already registered" };
      }

      // add a method here to figure out if the caller is the owner of the contract

      const provider = new JsonRpcProvider(pvtRPCs[networks[0]]);
      const contract = new Contract(collectionAddress, [
        "function name() external view returns (string memory)",
      ], provider);

      let name: null | string = null;
      try {
        const staticContract = contract.callStatic as { name: ContractFunction<string | undefined> };
        name = (await staticContract.name()) ?? null;
      } catch {}

      // adding the collection to the users holding if not added
      try {
        await ctx.prisma.collection.create({
          data: {
            collection_name: name,
            address: collectionAddress,
            owner_address: userAddress,
            networks: JSON.stringify({ chains: networks }),
          },
        });
        return { success: true, msg: "collection registered successfully" };
      } catch {
        return { success: false, msg: "registration failed" };
      }
    }),
});
