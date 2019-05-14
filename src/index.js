/** @jsx jsx */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Pagination, Grid, Input } from 'semantic-ui-react';
import _ from 'lodash';
import { jsx, css } from '@emotion/core';
import ReactPaginate from 'react-paginate';

const noDataBlock = css`
        padding: 5em;
        text-align: center;
        background-color: #f4f4f4;
        border: 1px dashed #c1c1c1;
`;

const noDataGridColumn = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
`;

class searchWithPagination extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      activePage: '1',
    };
  }


  init() {
    const { searchTerm, activePage } = this.state;
    const {
      listData, searchKey, children, propKey, perPage,
    } = this.props;

    // filtered data after search
    const filterdData = listData.filter(value => value[searchKey].toLowerCase().includes(searchTerm.toLowerCase()));
    //  spliting array as per pagelimit
    const filterddataList = _.chunk(filterdData, perPage);
    // determine correct page to fetch data
    const pageNumber = activePage > filterddataList.length ? 1 : activePage;
    // update props of children
    const clonedChildren = filterddataList.length ? React.Children.map(children, child => React.cloneElement(child, {
      [propKey]: filterddataList[pageNumber - 1] || [],
    })) : (this.getNoDataBlock());

    // create pagination block
    const totalPages = Math.ceil(filterdData.length / perPage);
    const paginationElement = totalPages ? this.generatePagination(totalPages, pageNumber) : null;

    return {
      clonedChildren,
      paginationElement,
    };
  }

  getNoDataBlock() {
    return (
      <div css={noDataBlock}>No data found</div>
      // <Grid css={{ marginTop: '10px !important' }}>
      //   <Grid.Row>
      //     <Grid.Column
      //       width={16}
      //       css={noDataGridColumn}
      //     >
      //       <div css={noDataBlock}>No data found</div>
      //     </Grid.Column>
      //   </Grid.Row>
      // </Grid>
    )
  }

  generatePagination(totalPages, activePage) {
    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePaginationChange}
        activePage={activePage}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      // <Pagination
      //   onPageChange={this.handlePaginationChange}
      //   totalPages={totalPages}
      //   activePage={activePage}
      // />
    )
  }

  handlePaginationChange(e) {
    this.setState({ activePage: e.target.innerText });
  }


  render() {
    const { paginationElement, clonedChildren } = this.init();
    return (
      <div className="searchnpaginate-container">
        <div css={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <input placeholder="Search..." size="large" className="searchInput" onChange={e => _.debounce(this.setState({ searchTerm: e.target.value }), 500)} />
        </div>
        {clonedChildren}
        <div css={{ display: 'flex', justifyContent: 'center' }}>
          {paginationElement}
        </div>
      </div>
    );
  }
}

searchWithPagination.defaultProps = {
  perPage: '5',
  children: null,
};

searchWithPagination.propTypes = {
  listData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchKey: PropTypes.string.isRequired,
  propKey: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  perPage: PropTypes.string,
};


export default searchWithPagination;
