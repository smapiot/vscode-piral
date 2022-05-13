import { FC } from 'react';
import { jsx } from '@emotion/react';
import { useStore } from '../store';
import selectedItemIcon from '../../../resources/selected-item.png';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  shortName: string;
  author: string;
  onClick: () => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({ id, title, description, shortName, author, onClick }) => {
  const { state } = useStore();
  const options = state.options;
  const cls = options.template === id ? `card template selectedCard` : `card template`;

  return (
    <div onClick={onClick} className={cls}>
      <img className="selectedCardTag" src={selectedItemIcon} />
      <div className="cardTitle">
        {shortName !== title && <p className="cardTitleTxt packageName">{shortName}</p>}
        <p className="cardTitleTxt onlyForTemplate">{title}</p>
      </div>
      <p className="cardDescription">{description}</p>
      <div className="cardFooter">
        <p>{author}</p>
      </div>
    </div>
  );
};
