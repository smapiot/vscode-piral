import * as React from 'react';
import selectedItemIcon from '../../../resources/selected-item.png';
import { Uri } from 'vscode';
import { useStore } from '../store';

interface CardProps {
  type: string;
  iconUri?: Uri;
  key: string;
  title: string;
  description: string;
  shortName?: string;
  author?: string;
  handleOnClick: () => void;
}

function getRef(iconUri: Uri) {
  const { scheme, authority, path } = iconUri;
  return `${scheme}://${authority}${path}`;
}

const Card: React.FC<CardProps> = ({ iconUri, title, description, type, shortName, author, handleOnClick }) => {
  const { state } = useStore();
  const options = state.options;
  const [allClasses, setAllClasses] = React.useState(`card ${type}`);

  React.useEffect(() => {
    switch (type) {
      case 'repoType':
        options.repoType === title.toLowerCase() ? setAllClasses(`card ${type} selectedCard`) : setAllClasses(`card ${type}`);
        break;

      case 'bundler':
        options.bundler === title ? setAllClasses(`card ${type} selectedCard`) : setAllClasses(`card ${type}`);
        break;

      case 'template':
        options.template === title ? setAllClasses(`card ${type} selectedCard`) : setAllClasses(`card ${type}`);
        break;
    }
  }, [options.repoType, options.bundler, options.template]);

  return (
    <div key={title} onClick={() => handleOnClick()} className={allClasses}>
      <img className="selectedCardTag" src={selectedItemIcon} />
      <div className="cardTitle">
        {iconUri && <img className="cardTitleIcon" src={getRef(iconUri)} />}
        {shortName && shortName !== title && <p className="cardTitleTxt packageName">{shortName}</p>}
        <p className={`cardTitleTxt ${type === 'template' && 'onlyForTemplate'}`}>{title}</p>
      </div>
      <p className="cardDescription">{description}</p>
      {author && (
        <div className="cardFooter">
          <p>{author}</p>
        </div>
      )}
    </div>
  );
};

export default Card;
