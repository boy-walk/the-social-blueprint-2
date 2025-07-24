import React from 'react';
import { Button } from './Button';
import Balloon404 from '../../assets/404.svg'

export function Page404() {
  return (
    <>
      <section className="bg-schemesPrimaryFixedDim">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-10">
          <div className="relative">
            <img
              src={Balloon404}
              alt="404 balloon illustration"
              className="w-[min(80vw,800px)] h-auto mx-auto"
            />
          </div>

          <h2 className="Blueprint-headline-large-emphasized">
            Oy vey! You've taken a wrong turn.
          </h2>
          <p className="Blueprint-body-large text-schemesOnSurfaceVariant max-w-lg">
            This page might be missing, but your connection to community isn’t.
            Let's get you back on track.
          </p>

          <Button
            style="filled"
            size="base"
            shape="square"
            label="Back to homepage"
            onClick={() => (window.location.href = '/')}
          />
        </div>
      </section>
    </>
  );
}
