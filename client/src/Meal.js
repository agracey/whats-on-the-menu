import React from 'react';
import { connect } from "react-redux";


class Meal extends React.Component {
    constructor(props){
        super(props)

        this.state= {
            value: props.value,
            editable: false
        }
    }

    getDerived

    setEdit (){
        this.setState({editable:true})
    }

    handleChange = event => {
        this.setState({ value: event.target.value })
    };

    renderValue() {
        console.log('renderValue',this.props)
        if (this.state.editable)
          return this.renderEditableValue()
        else return (<div>{this.props.value}</div>)
    }

    renderEditableValue(){
        console.log('renderEditable')
        return (<input value={this.state.value} onChange={this.handleChange} placeholder="Meal Name"/>)
    }

    render (){
        return (
            <div className="meal" onClick={this.setEdit.bind(this)}>
                <header>{this.props.meal}</header>
                {this.renderValue()}
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps)=>({
  ...ownProps,
  value: state[ownProps.day][ownProps.meal]
})

export default connect(mapStateToProps)(Meal)
