import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary mb-4">
          {statusCode || 'Error'}
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold rounded-lg transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

