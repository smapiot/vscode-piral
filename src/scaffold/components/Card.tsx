import { FC } from 'react';
import { jsx } from '@emotion/react';
import { Uri } from 'vscode';
import { useStore } from '../store';
import { getRef } from './utils';
import selectedItemIcon from '../../../resources/selected-item.png';

interface CardProps {
  type: 'repoType' | 'bundler' | 'client' | 'language';
  iconUri: Uri;
  id: string;
  title: string;
  description: string;
  onClick: () => void;
}

export const Card: FC<CardProps> = ({ iconUri, id, title, description, type, onClick }) => {
  const { state } = useStore();
  const options = state.options;
  const cls = options[type] === id ? `card selectedCard` : `card`;

  return (
    <div onClick={onClick} className={cls}>
      <img className="selectedCardTag" src={selectedItemIcon} />
      <div className="cardTitle">
        <img className="cardTitleIcon" src={getRef(iconUri)} />
        <p className="cardTitleTxt">{title}</p>
      </div>
      <p className="cardDescription">{description}</p>
    </div>
  );
};
