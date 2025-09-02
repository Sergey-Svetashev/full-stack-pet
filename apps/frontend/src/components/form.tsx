import { useForm } from "react-hook-form";
import { FormData } from "../models";
import { Button } from "./button";

export const Form = ({
  id = "form",
  onSubmit,
}: {
  id: string;
  onSubmit: (data: FormData) => void; // TODO: overload
  isLogin?: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(); // TODO: overload

  return (
    <form
      id={id}
      method="POST"
      className="max-w-64 mx-auto"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="mt-3">
        <label className="block" htmlFor="name">
          Email
        </label>
        <input
          id={`${id}_email`}
          type="email"
          placeholder="charlie.brown@example.com"
          {...register("email", { required: true })} // TODO: overload
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className="mt-3">
        <label className="block" htmlFor="confirmPassword">
          Password
        </label>
        <input
          id={`${id}_password`}
          type="text"
          {...register("password", { required: true })} // TODO: overload
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <Button text="Send" />
    </form>
  );
};
