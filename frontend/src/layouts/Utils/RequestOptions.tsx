type Props = {
  method: any;
  authorization: any;
};

export const RequestOptions = ({ method, authorization }: Props) => {
  return {
    method,
    headers: {
      Authorization: `Bearer ${authorization}`,
      'Content-Type': 'application/json',
    },
  };
};
