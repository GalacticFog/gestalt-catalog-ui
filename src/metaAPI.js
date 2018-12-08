import axios from 'axios';
import config from '../config';

// Axios Defaults
axios.defaults.baseURL = config.deployBaseURL;
axios.defaults.timeout = config.deployTimeout;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

const defaultCtx = {
  fqon: '',
  workspaceId: '',
  environmentId: '',
  token: '',
};

export default function API(ctx = defaultCtx) {
  const kubeAPI = axios.create({
    headers: {
      'Content-Type': 'application/yaml',
      Authorization: `Bearer ${ctx.token}`,
    },
  });

  const metaAPI = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ctx.token}`,
    },
  });

  function buildBaseURL() {
    switch (ctx.context) {
      case 'workspace':
        return `${ctx.fqon}/workspaces/${ctx.workspaceId}`;
      case 'environment':
        return `${ctx.fqon}/environments/${ctx.environmentId}`;
      default:
        return `${ctx.fqon}`;
    }
  }

  async function deployKube(providerId, namespace, releaseName, payload) {
    return await kubeAPI.post(`${ctx.fqon}/providers/${providerId}/kube/chart?namespace=${namespace}&source=helm&releaseName=${releaseName}&metaEnv=${ctx.environmentId}`, payload);
  }

  async function getProviders(type) {
    return  await metaAPI.get(`${buildBaseURL()}/providers?type=${type}`);
  }

  return Object.create({
    deployKube,
    getProviders,
  })
}