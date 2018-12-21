import axios from 'axios';
import { deployBaseURL, deployTimeout } from '../config';

// Axios Defaults
axios.defaults.baseURL = deployBaseURL;
axios.defaults.timeout = deployTimeout;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

const defaultCtx = {
  fqon: '',
  workspaceId: '',
  environmentId: '',
  token: '',
};

export default function API(ctx = defaultCtx) {
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
    const kubeAPI = axios.create({
      headers: {
        'Content-Type': 'application/yaml',
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    return await kubeAPI.post(`${ctx.fqon}/providers/${providerId}/kube/chart?namespace=${namespace}&source=helm&releaseName=${releaseName}&metaEnv=${ctx.environmentId}`, payload);
  }

  async function getProviders(type) {
    return  await metaAPI.get(`${buildBaseURL()}/providers?type=${type}`);
  }

  async function genericDeploy({ url, method = 'post', headers = "{}", payload }) {
    const methodToLower = method.toLowerCase();
    const parsedHeaders = JSON.parse(headers);
    const genericAPI = axios.create({
      headers: { ...parsedHeaders },
    });

    if (payload) {
      return await genericAPI[methodToLower](url, payload);
    }

    return await genericAPI[methodToLower](url);

  }

  return Object.create({
    deployKube,
    getProviders,
    genericDeploy,
  })
}