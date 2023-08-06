import { api } from "~/utils/api";

export const useSession = () => {
  const { data: session, isLoading: validating, refetch } = api.auth.getSession.useQuery({ forward: true }, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  return {
    session: session ? session : null,
    validating,
    refetch,
  };
};
