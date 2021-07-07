
import {IntlProvider,FormattedNumber} from 'react-intl';

class NumberFormat extends React.Component {
    render() {
        return (
            <IntlProvider locale={"en"}>
                <FormattedNumber
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                    value={this.props.value} />
            </IntlProvider>
        )
    }
}
export {
    NumberFormat
}
