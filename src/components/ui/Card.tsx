import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        "border-b border-gray-100 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardBody({
  children,
  className,
}: CardProps) {
  return (
    <div className={clsx("p-6", className)}>
      {children}
    </div>
  );
}

function CardFooter({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        "border-t border-gray-100 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardTitle({
  children,
  className,
}: CardProps) {
  return (
    <h2
      className={clsx(
        "text-xl font-semibold",
        className
      )}
    >
      {children}
    </h2>
  );
}

function CardDescription({
  children,
  className,
}: CardProps) {
  return (
    <p
      className={clsx(
        "mt-1 text-sm text-gray-500",
        className
      )}
    >
      {children}
    </p>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

type CardComponent = typeof Card & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
};

export default Card as CardComponent;