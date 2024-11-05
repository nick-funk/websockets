import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useState,
} from "react";

interface Props {
  onSubmit: (text: string) => void;
}

export const PostForm: FunctionComponent<Props> = ({ onSubmit }) => {
  const [text, setText] = useState<string>("");

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();

    onSubmit(text);
    setText("");
  }, [onSubmit, text, setText]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    [setText]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" multiple value={text} onChange={onChange} />
      <input type="submit" value="Submit" />
    </form>
  );
};
