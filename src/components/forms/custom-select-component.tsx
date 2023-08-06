import { Field } from "formik";
import { classNames } from "src/utils/utils";

interface IProps {
  value?: string | number;
  name: string;
  icon: JSX.Element;
  label: string;
  isPopular?: boolean;
  type: "radio" | "checkbox";
}

export default function CustomSelectComponent(props: IProps) {
  const { value, name, label, isPopular, icon, type } = props;
  const id = name + String(value);

  /**
   * @dev if the type is checkbox, aviod adding any value
   */
  if ((type === "radio" && !value) || (type === "checkbox" && value)) {
    console.error(
      "radio elements won't function without values and checkboxes won't function with values",
    );
  }

  return (
    <label htmlFor={id}>
      <Field
        id={id}
        value={value}
        name={name}
        type={type}
        className="hidden peer"
      />
      <div
        className={classNames(
          "flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow",
          "peer-checked:p-5 peer-checked:drop-shadow-xl peer-checked:border-2 peer-checked:border-[#05CE91] peer-checked:bg-gray-50",
        )}
      >
        <>{icon}</>
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        {isPopular
          ? (
            <span
              className={classNames(
                "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200",
                " rounded ",
              )}
            >
              Popular
            </span>
          )
          : null}
      </div>
    </label>
  );
}
