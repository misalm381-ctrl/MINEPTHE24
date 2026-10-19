```jsx
function ErrorMessage({
    message = "Something went wrong. Please try again.",
    onRetry = null
}) {
    return (
        <div className="minepthe-error">

            <div className="error-icon">
                !
            </div>

            <h3>
                Something went wrong
            </h3>

            <p>
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onRetry}
                >
                    Try Again
                </button>
            )}

        </div>
    );
}

export default ErrorMessage;
```

