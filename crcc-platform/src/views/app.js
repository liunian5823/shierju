import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Login from '@/pages/login';
import ReLogin from '@/pages/login/relogin';
import BasicInfomation from '@/pages/busunessQualification/basicInfomation';
import LawLitigation from '@/pages/busunessQualification/lawLitigation';
import ManagementRisk from '@/pages/busunessQualification/managementRisk';
import ManagementState from '@/pages/busunessQualification/managementState';

import Admin from './admin';
import { RouteList } from "../components/Route";
// import history from "../utils/history";
import routes from "./routes";

const App = props =>
	<Router>
		<Switch>
			<Route path="/login" component={Login}></Route>
			<Route path="/relogin" component={ReLogin}></Route>
			<Route path="/qualification/basicInfomation" component={BasicInfomation}></Route>
			<Route path="/qualification/lawLitigation" component={LawLitigation}></Route>
			<Route path="/qualification/managementRisk" component={ManagementRisk}></Route>
			<Route path="/qualification/managementState" component={ManagementState}></Route>
			{/* 为了/加载到 */}
			<Route path="/" render={() =>
				<Admin>
					<Switch>
						<RouteList routes={routes} />
						{/* <Route component={NotFound} /> */}
					</Switch>
				</Admin>
			}></Route>
		</Switch>
	</Router>

export default App;