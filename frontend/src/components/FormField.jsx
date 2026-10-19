```jsx
function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false,
    children
}) {
    const inputId = `field-${name}`;

    return (
        <div className="form-field">
            <label htmlFor={inputId}>
                {label}
                {required && <span className="required-mark"> *</span>}
            </label>

            {children ? (
                children
            ) : (
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    aria-required={required}
                />
            )}
        </div>
    );
}

export default FormField;
```

