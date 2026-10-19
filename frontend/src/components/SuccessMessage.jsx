```jsx
function SuccessMessage({
    message = "Action completed successfully."
}) {
    return (
        <div className="minepthe-success-message">
            <div className="success-icon">
                ✓
            </div>

            <p>{message}</p>
        </div>
    );
}

export default SuccessMessage;
```


