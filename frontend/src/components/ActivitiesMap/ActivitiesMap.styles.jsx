import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    height: 500,
    marginTop: 50,
    marginBottom: 50,
  },
});

export const StyledMap = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;
