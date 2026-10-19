function EmptyState({
    title = "No data found",
    message = "There is nothing to display here yet.",
    buttonText = "",
    onAction = null
}) {
    return (
        <div className="minepthe-empty">
            <div className="empty-icon">—</div>

            <h3>{title}</h3>

            <p>{message}</p>

            {buttonText && onAction && (
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onAction}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}

export default EmptyState;