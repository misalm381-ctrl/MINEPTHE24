```jsx
function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    message = "Please confirm this action.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirm-overlay">
            <div className="confirm-modal">

                <div className="confirm-icon">
                    ?
                </div>

                <h3>{title}</h3>

                <p>{message}</p>

                <div className="confirm-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ConfirmModal;
```

