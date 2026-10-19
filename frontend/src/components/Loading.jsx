```jsx
function Loading({ message = "Loading MINEPTHE..." }) {
    return (
        <div className="minepthe-loading">

            <div className="loading-spinner"></div>

            <p>{message}</p>

        </div>
    );
}

export default Loading;
```

