export default function FacebookIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <div className="flex items-center">
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.96875 9H6.625V16H3.5V9H0.96875V6.09375H3.5V3.90625C3.5 2.65625 3.84375 1.69792 4.53125 1.03125C5.21875 0.34375 6.13542 0 7.28125 0C7.61458 0 7.96875 0.0208333 8.34375 0.0625C8.71875 0.0833333 9.01042 0.114583 9.21875 0.15625L9.53125 0.1875V2.65625H8.28125C7.69792 2.65625 7.27083 2.8125 7 3.125C6.75 3.41667 6.625 3.78125 6.625 4.21875V6.09375H9.40625L8.96875 9Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
