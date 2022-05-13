import { FC } from 'react';
import { jsx } from '@emotion/react';
import { bundlers, cards } from '../styles';

interface CardSelectorProps {
  title: string;
}

export const CardSelector: FC<CardSelectorProps> = ({ title, children }) => {
  return (
    <div className="bundlersWrapper" css={bundlers}>
      <div className="bundlers">
        <p className="columnTitle">{title}</p>
        <div className="bundlersCards" css={cards}>
          {children}
        </div>
      </div>
    </div>
  );
};
