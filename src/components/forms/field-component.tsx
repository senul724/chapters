import { BadgeCheckIcon, XCircleIcon } from "@heroicons/react/solid";
import { Field } from "formik";
import { Loader } from "../utils/loader";
interface IProps {
  name: string;
  type?: string;
  label?: string | JSX.Element;
  icon?: JSX.Element;
  placeholder?: string;
  error?: string | boolean | undefined;
  touched?: boolean | undefined;
  validation?: (value: string) => string | undefined;
  completion?: "on" | "off";
  className?: string;
}

interface IPropsForLoader {
  name: string;
  type?: string;
  label: string | JSX.Element;
  placeholder?: string;
  error?: string | boolean | undefined | null;
  touched?: boolean | undefined;
  validation?: (value: string) => string | undefined;
  completion?: "on" | "off";
  isValidating: boolean;
  isValid: boolean;
  loaderVisibility: boolean;
}

export const CustomTextBox = (props: IProps) => {
  const {
    name,
    type,
    label,
    error,
    touched,
    placeholder,
    validation,
    completion,
    className,
  } = props;
  return (
    <>
      <div className="">
        <span className="">
          <label className="">{label}</label>
        </span>
        <Field
          as="textarea"
          name={name}
          type={type}
          placeholder={placeholder}
          validate={validation}
          autoComplete={completion}
          className={className}
        />
      </div>
      {error && touched ? <div className="text-xs text-red-600">{error}</div> : null}
    </>
  );
};

export const CustomField = (props: IProps) => {
  const {
    name,
    type,
    label,
    icon,
    error,
    touched,
    placeholder,
    validation,
    completion,
    className,
  } = props;

  return (
    <>
      {label
        ? (
          <div className="flex flex-col gap-2">
            <span className="text-xl font-semibold text-gray-900">
              <label className="">{label}</label>
            </span>{" "}
            {error && touched ? <p className="my-1 text-xs text-red-600">{error}</p> : null}
            <Field
              name={name}
              type={type}
              placeholder={placeholder}
              validate={validation}
              autoComplete={completion}
              className={className}
            />
          </div>
        )
        : (
          <div className="">
            <label>{icon}</label>
            {error && touched ? <p className="my-1 text-xs text-red-600">{error}</p> : null}
            <Field
              name={name}
              type={type}
              placeholder={placeholder}
              validate={validation}
              autoComplete={completion}
              className={className}
            />
          </div>
        )}
    </>
  );
};

export const CustomFieldWithLoader = (props: IPropsForLoader) => {
  const {
    name,
    type,
    label,
    error,
    placeholder,
    validation,
    completion,
    isValid,
    isValidating,
    loaderVisibility,
  } = props;

  return (
    <>
      <div>
        <span>
          <label className="">{label}</label>
        </span>
        {error && !isValidating ? <div className="my-1 text-xs text-red-600">{error}</div> : null}
        <div className={`$"" flex gap-2`}>
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            validate={validation}
            autoComplete={completion}
          />
          {loaderVisibility
            ? (
              <span>
                {isValidating ? <Loader width={5} height={5} /> : (
                  <>
                    {isValid
                      ? <BadgeCheckIcon className="w-7 h-7 text-green-600" />
                      : <XCircleIcon className="w-7 h-7 text-red-600" />}
                  </>
                )}
              </span>
            )
            : (
              null
            )}
        </div>
      </div>
    </>
  );
};
