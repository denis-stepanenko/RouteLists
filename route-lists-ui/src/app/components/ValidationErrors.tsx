import { useEffect } from "react";
import { Message } from "semantic-ui-react";

interface Props {
    errors: string[];
}

export default function ValidationErrors({errors}: Props) {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
    }, [errors])

  return (
    <Message error>
        {errors && (
            <Message.List>
                {errors.map((err: string, i) => (
                    <Message.Item key={i}>{err}</Message.Item>
                ))}
            </Message.List>
        )}
    </Message>
  )
}
