export function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit"
}) {
  return (
    <button disabled={disabled} type={type}
      className={`button button--${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

