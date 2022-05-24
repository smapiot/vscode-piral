import { FC } from 'react';
import { jsx } from '@emotion/react';
import { bundlers, cards, columnTitle } from '../styles';

interface CardSelectorProps {
  title: string;
}

export const CardSelector: FC<CardSelectorProps> = ({ title, children }) => {
  return (
    <div css={bundlers}>
      <div>
        <p css={columnTitle}>{title}</p>
        <div css={cards}>
          {children}
        </div>
      </div>
    </div>
  );
};
