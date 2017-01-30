// var Falcor = require('falcor'),
//     FalcorDataSource = require('falcor-http-datasource'),
import Falcor from 'falcor';
import FalcorDataSource from 'falcor-http-datasource' ;

// const ContestList = ({ contest, onContestClick }) => (
// 	<div className="ContestList">
// 		{Object.keys(contest).map( contestId =>
// 			<ContestPreview 
// 			key={contestId} 
// 			onClick={onContestClick}
// 			{...contest[contestId]} />
// 		)}
// 	</div>
// );


var model = new Falcor.Model({
        source: new FalcorDataSource('/model.json')
    })
export default model;
