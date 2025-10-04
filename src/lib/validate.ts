
interface Values {
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export const validate = (values: Values ) => {
    const errors: Errors = {};
    if (!values.email) {
        errors.email = "Field is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }

     if (!values.password) {
      errors.password = "Field Required";
    } else if (values.password.includes(" ")) {
      errors.password = "Password Should Not Contain Spaces";
    } else if (values.password.length < 8) {
      errors.password = "Password should have at least 8 characters";
    } else if (!/^(?=.*[0-9]).+$/.test(values.password)) {
      errors.password = "Must have at least one number";
    } else if (!/^(?=.*[A-Z]).+$/.test(values.password)) {
      errors.password = "Password must contain atleast 1 uppercase letter";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "Field Required";
    } else if (values.confirmPassword != values.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
};