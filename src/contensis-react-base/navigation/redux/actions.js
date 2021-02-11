import { action } from '%/util/helpers';

import { GET_NODE_TREE } from '%/navigation/redux/types';

export const loadNavigationTree = () => action(GET_NODE_TREE);
