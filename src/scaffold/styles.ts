import { css } from '@emotion/react';

export const globalStyle = css`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #242423;
  }

  .page {
    padding: 1rem;
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;

    & > div + div {
      margin-top: 1.5rem;
    }
  }

  .title {
    font-weight: 600;
    margin: 1rem 0;
    font-size: 1.5rem;
    margin-bottom: 0.625rem;
    color: #fff;
  }

  .subTitle {
    font-size: 0.75rem;
    color: #fff;
    font-weight: lighter;
  }

  .columnTitle {
    position: relative;
    width: 100%;
    height: 1.25rem;
    font-size: 0.875rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 1.563rem;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;

    & .firstContainer {
      overflow: scroll;
      flex: 1;
    }
  }

  .selectedCardTag {
    display: none;
    position: absolute;
    top: 0.125rem;
    right: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
  }

  .selectedCard {
    padding: 0.563rem;
    border: 0.063rem solid #0e639c !important;

    &:hover {
      border: 0.063rem solid #0e639c !important;
    }

    & .selectedCardTag {
      display: block;
    }
  }

  .sideBorder {
    position: relative;
    bottom: 0.375rem;
    width: 0.063rem;
    background: #434557;
    margin-right: 2.5rem;
    margin-left: 2.5rem;
  }

  .containerInfos {
    display: flex;
    flex: 1;
    height: 100%;

    .information{
      margin-right: 1.5rem;
    }
  }

  .card {
    padding: 0.625rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1rem;
    height: 7rem;
    border: 0.063rem solid #47524a;
    overflow: hidden;
    cursor: pointer;
    max-width: 13.75rem;
    min-width: 8.125rem;
  }

  .card:hover {
    border: 0.063rem solid #0e639c !important;
  }

  .card.template {
    max-width: 13.75rem;
    min-width: 10rem;
    margin: 0 1rem 1rem 0;
    background-image: linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgba(63, 61, 61, 1) 78.9%);
    height: 10.25rem;
    padding: 14px;
    justify-content: space-between;


    & .cardTitle {
      margin-top: 16px;
      display: flex;
      flex-direction: column; 
    }

    & .cardDescription {
      position: relative;
      bottom: 10px;
    }

    & .cardTitle .packageName {
      font-size: 11px;
    }
    
    & .spaceTop {
      position: relative;
      bottom: 1px;
    }

    & .cardFooter {
      border-top: 1px solid;
      padding-top: 1px;
      font-size: 0.75rem;
      color: #979797;
      line-height: 1.125rem;
    }
  }

  .cardTitle {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .cardTitleIcon {
    width: 1.875rem;
    height: 1.875rem;
  }

  .cardTitleTxt {
    margin-left: 0.875rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }

  .cardDescription {
    font-size: 0.75rem;
    color: #979797;
    line-height: 1.125rem;
  }

  .templates {
    display: flex;
    flex: 1;
    flex-direction: column;

    & .templatesNames,
    & spinnerContainer {
      display: flex;
      flex-wrap: wrap;
    }

    & .template .cardTitle,
    & .template .cardTitle {
      margin: 0;
    }
  }

  .spinnerContainer {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    display: inline-block;
    width: 5rem;
    height: 5rem;

    &::after {
      content: ' ';
      display: block;
      width: 4rem;
      height: 4rem;
      margin: 0.5rem;
      border-radius: 50%;
      border: 0.375rem solid #0e639c;
      border-color: #0e639c transparent #0e639c transparent;
      animation: spinner 1.2s linear infinite;
    }
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .extraItem {
    position: relative;
    bottom: 0.313rem;
    margin-bottom: 1rem;
    width: 120%;

    & .extraItemLabel {
      margin-bottom: 0.125rem;
    }

    & .foldersImg {
      margin: 0.313rem;
      margin-bottom: 0.25rem;
    }

    & vscode-text-field.extraItemInput {
      width: 100%;
    }

    & vscode-text-field span {
      height: 2rem;
      cursor: pointer;
    }
  }

  .bundlers {
    flex: 1;
    overflow: scroll;

    & .bundlersCards {
      display: flex;
      flex-wrap: wrap;
    }

    & .bundler {
      width: 13.75rem;
      margin: 0 1rem 1rem 0;
      height: 8rem;
    }
  }

  .btnContainer {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 2rem;
  }

  .hide {
    display: none !important;
  }

  .errorMessage {
    font-size: 0.875rem;
    color: #ff1010;
    margin-bottom: 0.625rem;
  }

  span {
    margin-bottom: 0.625rem;
    padding-bottom: 0.625rem;
  }

  .radioGroup {
    display: flex;
    gap: 6px;
  }
`;
