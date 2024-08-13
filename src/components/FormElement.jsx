import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormElementWrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 10px;
`;

const FormElement = ({ label, icon, children }) => {
  return (
    <FormElementWrapper>
      <Label>{label}</Label>
      <InputWrapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {children}
      </InputWrapper>
    </FormElementWrapper>
  );
};

FormElement.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  children: PropTypes.node.isRequired,
};

export default FormElement;
