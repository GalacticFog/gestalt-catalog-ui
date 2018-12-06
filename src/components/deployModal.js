import React from 'react';
import { isEqual, get } from 'lodash';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Form from '../components/form';
import withContext from '../hocs/withContext';
import metaAPI from '../metaAPI';

const Progress = styled(LinearProgress)`
  flex-grow: 1;
  outline: none;
`;

class FormDialog extends React.Component {
  state = {
    providers: [],
    error: null,
    pending: false,
    providerId: '',
    namespace: '',
    releaseName: '',
  }
  async componentDidUpdate(prevProps) {
    const { context } = this.props;
    if (!isEqual(prevProps.context, this.props.context)) {
      const API = new metaAPI(context);
      const { data } = await API.getProviders('Kubernetes');
      this.setState({ providers: data });
    }
  }
  
  componentDidMount() {
    window.addEventListener('message', this.msgHandler);
    window.parent.postMessage('ready', '*');
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.msgHandler);
  }

  msgHandler = ({ data }) => {
    this.setState(() => ({
      context: { ...data },
    }));
  }

  handleClose = () => {
    this.props.onRequestClose();
  };

  handleInputChange= (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const { context, node } = this.props;
    const { providerId, namespace, releaseName } = this.state;
    const API = new metaAPI(context);

    try {
      this.setState({ error: null, pending: true });
      await API.deployKube(providerId, namespace, releaseName, node.AssetsYaml);
      this.handleClose();
    } catch (error) {
      this.setState({ error: get(error, 'response.data') || error });
    } finally {
      this.setState({ pending: false });
    }
  }

  render() {
    const { node } = this.props;
    const { providerId, providers, error, pending } = this.state;

    return (
      <Dialog
        open
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <Form onSubmit={this.handleSubmit} disabled={pending} autoComplete="off">
          <DialogTitle id="form-dialog-title">{`Deploy ${node.Chart.name}`}</DialogTitle>
          <DialogContent>           
            <FormControl fullWidth required>
              <InputLabel htmlFor="providerId">Provider</InputLabel>
              <Select
                name="providerId"
                required
                input={<Input id="providerId" autoFocus required />}
                value={providerId}
                onChange={this.handleInputChange}
              >
                {!providers.length > 0 && <Progress id="loading-providers" />}
                {providers.map(provider => (
                  <MenuItem key={provider.id} value={provider.id}>
                    <ListItemText primary={provider.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <TextField
                margin="dense"
                id="namespace"
                label="Namespace"
                name="namespace"
                type="text"
                required
                onChange={this.handleInputChange}
              />
            </FormControl>
            
            <FormControl fullWidth>
              <TextField
                margin="dense"
                id="Release"
                label="Release Name"
                name="releaseName"
                type="text"
                required
                onChange={this.handleInputChange}
              />
            </FormControl>
        
          </DialogContent>

          {error && <DialogContent>
            <DialogContentText>
              <div>{JSON.stringify(error, null, 2)}</div>
            </DialogContentText>
          </DialogContent>}

          {pending && <Progress id="loading" />}
          
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" disabled={pending}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={!providerId || pending}>
              Deploy
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

export default withContext(FormDialog);
