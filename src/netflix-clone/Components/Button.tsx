import React from "react";
import styled from "styled-components";

const BaseButton = styled.button`
  display: flex;
  background-color: rgba(255, 255, 255, 1);
  border: 2px solid rgba(255, 255, 255, 0);
  color: black;
  padding: 12px 32px;
  font-size: 24px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:active {
    background-color: rgba(255, 255, 255, 0.75);
    border: 2px solid rgba(255, 255, 255, 1);
  }
  svg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

const InfoButton = styled(BaseButton)`
  background-color: rgba(109, 109, 110, 0.7);
  border: 2px solid rgba(255, 255, 255, 0);
  color: white;
  /* padding: 10px 20px; */
  &:active {
    background-color: rgba(109, 109, 110, 0.4);
    border: 2px solid rgba(255, 255, 255, 1);
  }
`;

const ButtonPlay: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <BaseButton onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
      </svg>
      <span>재생</span>
    </BaseButton>
  );
};

const ButtonInfo: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <InfoButton onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1.5" />
        <path
          d="M12 17V11"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="1"
          cy="1"
          r="1"
          transform="matrix(1 0 0 -1 11 9)"
          fill="#ffffff"
        />
      </svg>
      <span>상세 정보</span>
    </InfoButton>
  );
};

export { ButtonPlay, ButtonInfo };
