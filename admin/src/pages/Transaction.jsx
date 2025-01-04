import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import formatDate from "../util/formateDate";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 cột với kích thước đều nhau */
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-weight: bold;
  font-size: 0.875rem;
`;

const TableCol = styled.div`
  max-width: 150px; /* Giới hạn chiều rộng */
  overflow: hidden; /* Ẩn nội dung tràn */
  text-overflow: ellipsis; /* Thêm dấu "..." khi nội dung quá dài */
  white-space: nowrap; /* Không cho xuống dòng */
  padding: 0.5rem;
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 cột với kích thước đều nhau */
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  font-size: 0.875rem;
`;


const Transaction = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTransactions = async (page = 1, limit = 1) => {
    try {
      const response = await axios.get(`${backendUrl}/transaction?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Lưu dữ liệu vào state
      setTransactions(response.data.DT.transactions);
      setTotalPages(response.data.DT.pagination.totalPages);
      setCurrentPage(response.data.DT.pagination.currentPage);
      console.log(transactions);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchTransactions(selectedPage);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <p className="mb-2">Transactions</p>
  
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <TableRow>
          <TableCol>Order ID</TableCol>
          <TableCol>User Name</TableCol>
          <TableCol>Status</TableCol>
          <TableCol>Amount</TableCol>
          <TableCol>Date</TableCol>
          <TableCol>Admin Balance</TableCol>
        </TableRow>
  
        {/* Category List */}
        {transactions.map((item, index) => (
          <TransactionRow key={index}>
            <TableCol title={item.orderId}>{item.orderId}</TableCol>
            <TableCol>{item.fromAccountId.userName}</TableCol>
            <TableCol>{item.status}</TableCol>
            <TableCol>{item.amount} $</TableCol>
            <TableCol title={formatDate(item.updatedAt)} >{formatDate(item.updatedAt)}</TableCol>
            <TableCol>{item.toAccountId.balance} $</TableCol>
          </TransactionRow>
        ))}
      </div>

      <ReactPaginate
        className="flex justify-center my-5 gap-3"
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages} // Số lượng trang
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"} // Lớp CSS cho container
        activeClassName={"active px-3"} // Lớp CSS cho trang hiện tại
      />
    </>
  );
};

Transaction.propTypes = {
  token: PropTypes.string.isRequired,
};
export default Transaction;
