#!/usr/bin/env node
import 'dotenv/config';

import { App, Tags } from 'aws-cdk-lib';
import { FacebookGroupModeratorStack } from '../src';

const app = new App();
new FacebookGroupModeratorStack(app, 'FacebookGroupModeratorStack');

Tags.of(app).add('project', 'facebook-group-moderator');
