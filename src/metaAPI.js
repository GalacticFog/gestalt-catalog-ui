import axios from 'axios';
import { deployTimeout } from '../config';

// Axios Defaults
axios.defaults.timeout = deployTimeout;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

const defaultCtx = {
  token: '',
  contextMeta: {
    fqon: '',
    workspaceId: '',
    environmentId: '',
  },
};

export default function API(ctx) {
  const context = { ...defaultCtx, ...ctx };

  const metaAPI = axios.create({
    baseURL: ctx.baseURL,
    timeout: ctx.timeout,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ctx.token}`,
    },
  });

  function buildBaseURL() {
    const { contextMeta } = context;

    switch (contextMeta.context) {
      case 'workspace':
        return `${contextMeta.fqon}/workspaces/${contextMeta.workspaceId}`;
      case 'environment':
        return `${contextMeta.fqon}/environments/${contextMeta.environmentId}`;
      default:
        return `${contextMeta.fqon}`;
    }
  }

  async function deployKube(providerId, releaseName, payload) {
    const { contextMeta, baseURL, timeout, token } = context;

    const kubeAPI = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/yaml',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!contextMeta.fqon || !contextMeta.environmentId) {
      throw new Error('deployment requires that the context contain an fqon and an environment id ');
    }

    return await kubeAPI.post(`${contextMeta.fqon}/providers/${providerId}/kube/chart?namespace=${contextMeta.environmentId}&source=helm&releaseName=${releaseName}&metaEnv=${contextMeta.environmentId}`, payload);
  }

  async function getProviders(type) {
    return await metaAPI.get(`${buildBaseURL()}/providers?type=${type}`);
  }

  async function genericDeploy({ url, method = 'post', headers = "{}", payload }) {
    const { token } = context;
    const methodToLower = method.toLowerCase();
    const parsedHeaders = JSON.parse(headers);
    const genericAPI = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        ...parsedHeaders,
      },
    });

    if (payload) {
      const fullPayload = {
        context,
        payload,
      };

      return await genericAPI[methodToLower](url, fullPayload);
    }

    return await genericAPI[methodToLower](url);

  }

  return Object.create({
    deployKube,
    getProviders,
    genericDeploy,
  })
}