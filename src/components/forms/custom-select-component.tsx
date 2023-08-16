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
          "flex items-center p-3 text-base font-bold text-[#ffc400] border border-[#ffc400] rounded-lg hover:scale-105 group",
          "peer-checked:scale-110 peer-checked:bg-gray-900",
        )}
      >
        <>{icon}</>
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        {isPopular
          ? (
            <span
              className={classNames(
                "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-[#ffc400] border border-[#ffc400]",
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
