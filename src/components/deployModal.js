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
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Form from '../components/form';
import Code from '../components/code';
import withContext from '../hocs/withContext';
import metaAPI from '../metaAPI';

const Progress = styled(LinearProgress)`
  flex-grow: 1;
  outline: none;
`;

class FormDialog extends React.Component {
  state = {
    providers: [],
    response: null,
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
      if (node.deploy.enabled) {
        this.setState({ error: null, pending: true });

        if (node.deploy.type === 'generic') {
 
          const { data } = await API.genericDeploy({
            url: node.deploy.url,
            method: node.deploy.method,
            headers: node.deploy.headers,
            payload: node.payload.data,
          });
          
          this.setState({ response: data })
        }

        if (node.deploy.type === 'custom') {
          const { data } = await API.deployKube(providerId, namespace, releaseName, node.payload.data);
          this.setState({ response: data })
        }
      }

      // this.handleClose();
    } catch (error) {
      this.setState({ response: get(error, 'response.data') || error });
    } finally {
      this.setState({ pending: false });
    }
  }

  renderForm() {
    const { node } = this.props;
    const { providerId, providers} = this.state;

    if (node.deploy.type === 'generic') {
      return (
        <Typography variant="subtitle2">
          Deploy {node.meta.name}
          <pre>{JSON.stringify(node.deploy, null, 2)}</pre>
        </Typography>
      );
    }

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  disableSubmit() {
    const { node } = this.props;
    const { providerId, pending } = this.state;
    
    if (node.deploy.type === 'custom' && (!providerId || pending)) {
      return true;
    }

    return false;
  }

  render() {
    const { node } = this.props;
    const { response, pending } = this.state;

    return (
      <Dialog
        open
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <Form onSubmit={this.handleSubmit} disabled={pending} autoComplete="off">
          <DialogTitle id="form-dialog-title">{`Deploy ${node.meta.name}`}</DialogTitle>
          <DialogContent>           
            {this.renderForm()}

          </DialogContent>

          {pending && <Progress id="loading" />}
          
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" disabled={pending}>
              {response ? 'Close' : 'Cancel'}
            </Button>
            {!response && 
            <Button color="primary" type="submit" disabled={this.disableSubmit()}>
              Deploy
            </Button>}
          </DialogActions>
        </Form>
        
        {response && <DialogContent>
          <Typography variant="subtitle2">
            Deploy Status
          </Typography>
        </DialogContent>}
        {response && <Code mode="json" value={JSON.stringify(response, null, 2)} />}
      </Dialog>
    );
  }
}

export default withContext(FormDialog);
