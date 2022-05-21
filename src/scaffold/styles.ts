import { css } from '@emotion/react';

export const globalStyle = css`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #242423;
  }

  span {
    margin-bottom: 0.625rem;
    padding-bottom: 0.625rem;
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

  .columnTitle {
    position: relative;
    width: 100%;
    height: 1.25rem;
    font-size: 0.875rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 1.563rem;
  }

  .containerWrapper {
    flex: 1;
    overflow: hidden;
  }

  .templatesWrapper {
    flex: 1;
  }

  .bundlersWrapper {
    margin: 1.25rem 0rem 0.75rem;
  }

  .spinnerWrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .sideBorder {
    position: relative;
    bottom: 0.375rem;
    width: 0.063rem;
    background: #434557;
    margin-right: 2.5rem;
    margin-left: 2.5rem;
  }

  .btnContainer {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
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

  .scroll {
    overflow: scroll;
  }

  .scroll::-webkit-scrollbar {
    display: none;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .fullPage {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    row-gap: 1.5rem;
  }

  .success {
    width: 9rem;
    height: 9rem;

    .animation_container {
      border-radius: 100%;
      background-color: #fff;
      box-shadow: 0 0 0 1px #e7e6e3;
      width: 100%;
      height: 100%;
      position: relative;

      animation: grow_background .5s ease-in forwards;

      .tick {
        height: 2.5rem;
        left: calc(50% - 2.5rem);
        position: absolute;
        top: 2.5rem;
        transform: rotate(-45deg);
        width: 5rem;

        &::before {
          animation: animate_tick_first .5s .5s ease-in forwards;
          background-color: #88ba14;
          border-radius: 6px / 2 6px / 2 0 0;
          content: "";
          height: 0;
          left: 0;
          position: absolute;
          top: 0;
          width: 6px;
        }

        &::after {
          animation: animate_tick_second .5s 1s ease-out forwards;
          background-color: #88ba14;
          border-radius: 0 6px / 2 6px / 2 0;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: calc(100% - 1px);
          width: 0;
        }
      }
    }
  }

  @keyframes grow_background {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes animate_tick_first {
    0% {
      height: 0;
    }

    100% {
      height: 2.5rem;
    }
  }

  @keyframes animate_tick_second {
    0% {
      width: 0;
    }

    100% {
      width: 5rem;
    }
  }
`;

export const header = css`
  .title {
    font-weight: 600;
    margin: 1rem 0;
    font-size: 1.5rem;
    margin-bottom: 0.625rem;
  }

  .subTitle {
    font-size: 0.75rem;
    color: #fff;
    font-weight: lighter;
  }
`;

export const container = css`
  .container {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100%;

    .containerInfos {
      display: flex;
      flex: 1;
      height: 100%;
    }

    .secondPage {
      flex-direction: column;
      overflow: scroll;
    }

    .information {
      margin-right: 1.5rem;
    }
  }
`;

export const templates = css`
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
`;

export const bundlers = css`
  .bundlers {
    & .bundlersCards {
      display: flex;
      flex-wrap: wrap;
    }

    & .card {
      width: 13.75rem;
      margin: 0 1rem 1rem 0;
      height: 8rem;
    }
  }
`;

export const cards = css`
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
    height: 15.25rem;
    padding: 0.875rem;
    justify-content: space-between;

    & .cardTitle {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
    }

    & .cardDescription {
      position: relative;
      bottom: 2.75rem;
    }

    & .onlyForTemplate {
      font-size: 0.688rem;
    }

    & .spaceTop {
      position: relative;
      bottom: 2.25rem;
    }

    & .cardFooter {
      border-top: 0.063rem solid;
      padding-top: 0.063rem;
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
`;

export const infosInputs = css`
  .inputsWrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .extraItem {
    position: relative;
    bottom: 0.313rem;
    margin-bottom: 1rem;
    margin: 0 1rem 1rem 0;
    width: 28.75rem;
    min-width: 13.75rem;

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

  .radioGroup {
    display: flex;
    gap: 0.375rem;
  }
`;

export const spinner = css`
  vscode-progress-ring {
    width: 100px;
    height: 50px;
  }
`;
