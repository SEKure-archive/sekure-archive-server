import * as application from '../src/application';
import { Db } from '../src/db';

export const APPLICATION = application.start();

before(done => { Db.initialize().then(() => { done(); }); });
after(done => { Db.terminate(); done(); });

import './accounts';
import './folders';
import './files';
