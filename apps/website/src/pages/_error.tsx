import Error from 'next/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomErrorComponent = (props: any) => {
  return <Error statusCode={props.statusCode} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
CustomErrorComponent.getInitialProps = async (contextData: any) => {
  // This will contain the status code of the response
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
