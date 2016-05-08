/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  NativeModules
} from 'react-native';



class StationBoard extends Component {


/**
 * Constructor
 */
constructor(props) {
  super(props)

  this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  this.state = {
    loaded: false,
    visibleBoard : {
      generatedAt: 'loading...',
      nrccMessages: this.ds.cloneWithRows([]),
      trainServices: this.ds.cloneWithRows([]),
    },
  }
}

/**
 * equivalent to onCreate() of activity/fragment
 */
componentWillMount() {

  fetch('https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb8.asmx', {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': "http://thalesgroup.com/RTTI/2015-05-14/ldb/GetDepBoardWithDetails",
      },
      body: "<soapenv:Envelope xmlns:ldb='http://thalesgroup.com/RTTI/2015-11-27/ldb/' xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:typ='http://thalesgroup.com/RTTI/2013-11-28/Token/types'>  <soapenv:Header>    <typ:AccessToken>      <typ:TokenValue>f003911d-94ee-4636-afe6-f04e6465feef</typ:TokenValue>    </typ:AccessToken>  </soapenv:Header>  <soapenv:Body>    <ldb:GetDepBoardWithDetailsRequest>      <ldb:numRows>10</ldb:numRows>      <ldb:crs>SLO</ldb:crs>      <!--Optional:-->      <ldb:filterCrs>MAI</ldb:filterCrs>      <!--Optional:-->      <ldb:filterType>to</ldb:filterType>      <!--Optional:-->      <ldb:timeOffset>0</ldb:timeOffset>      <!--Optional:-->      <ldb:timeWindow>120</ldb:timeWindow>    </ldb:GetDepBoardWithDetailsRequest>  </soapenv:Body></soapenv:Envelope>"
    })
    .then((response) => response.text())
    .then((responseText) => {
      //console.log(responseText);
      NativeModules.Xml2Json.convert(responseText ,
        (departedBoard) => {
          let gen = JSON.parse(departedBoard);

          // convert Array to Datasource
          if (gen.nrccMessages){
            gen.nrccMessages = this.ds.cloneWithRows(gen.nrccMessages);
          } else {
            gen.nrccMessages = this.ds.cloneWithRows([]);
          }
          if (gen.trainServices) {
            gen.trainServices = this.ds.cloneWithRows(gen.trainServices);
          } else {
            gen.nrccMessages = this.ds.cloneWithRows([]);
          }
          console.log(gen.generatedAt);

          this.setState({loaded: true, visibleBoard : gen });
        }
      );
    })
    .catch((error) => {
      console.warn(error);
    })
    .done();
}


_renderTrainServiceRow(rowData: string, sectionID: number, rowID: number) {
    // var rowHash = Math.abs(hashCode(rowData));
    // var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];

    var rowStyle = styles.messagesRow;
    if(rowData.estimatedDeparture != 'On time') {
        rowStyle = styles.messagesRowDelayed;
    }

    return (
      <TouchableHighlight >
        <View style={rowStyle}>
            <Text style={styles.messagesRowContent}>
              {rowData.destination.location.locationName}
            </Text>
              <Text style={styles.messagesRowContent}>
                {rowData.standardDeparture + ' - ' + rowData.estimatedDeparture}
              </Text>
        </View>
      </TouchableHighlight>
    );
  }

_renderStringRow(rowData: string, sectionID: number, rowID: number) {
    // var rowHash = Math.abs(hashCode(rowData));
    // var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
    return (
      <TouchableHighlight >
        <View style={styles.messagesRow}>
            <Text style={styles.messagesRowContent}>
              {'- ' + rowData }
            </Text>
        </View>
      </TouchableHighlight>
    );
  }


  /**
   * rende the UI
   */

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.stationBoardLocation}>
          Station: {this.state.visibleBoard.locationName}
        </Text>
        <Text style={styles.instructions}>
          To or calling at: {this.state.visibleBoard.filterLocationName}
        </Text>

        <View style={styles.messagesList}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.visibleBoard.trainServices}
            renderRow={this._renderTrainServiceRow}
          />
        </View>


        <View style={styles.bottomContainer}>
          <View style={styles.messagesList}>
            <ListView
              enableEmptySections={true}
              dataSource={this.state.visibleBoard.nrccMessages}
              renderRow={this._renderStringRow}
            />
          </View>
          <View>
            <Text style={styles.bottomStatus}>
              Generated at: {this.state.visibleBoard.generatedAt}
            </Text>
          </View>
        </View>
      </View>
    );
  }

} // class

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stationBoardLocation: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  messagesList: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  messagesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#AA7777'
  },
  messagesRowDelayed: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#AA0000',
  },
  messagesRowContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 15,
    margin: 10,
  },
  bottomStatus: {
    fontSize: 13,
    textAlign: 'left',
    margin: 10,
  },
});

AppRegistry.registerComponent('StationBoard', () => StationBoard);
