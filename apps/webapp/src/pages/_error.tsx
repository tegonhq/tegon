import * as Sentry from '@sentry/nextjs';
import { Button } from '@tegonhq/ui/components/button';
import Error from 'next/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomErrorComponent = (props: any) => {
  const reload = () => {
    window.location.reload();
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center flex-col">
      <h1>
        {props.statusCode ? `Error ${props.statusCode}` : 'An error occurred'}
      </h1>
      <p>
        {props.statusCode === 404
          ? 'Page not found'
          : 'Something went wrong on our end. Please try again later.'}
      </p>
      <Button variant="secondary" className="mt-2" onClick={reload}>
        Reload page
      </Button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
CustomErrorComponent.getInitialProps = async (contextData: any) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
