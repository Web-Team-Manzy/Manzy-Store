/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import axios from "../customize/axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import formatDate from "../util/formateDate";
import styled from "styled-components";
import ReactPaginate from "react-paginate";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 6 cột với kích thước đều nhau */
  align-items: center;
  border: 1px solid #ddd;
  background-color: rgb(243 244 246);
  font-weight: bold;
  font-size: 0.875rem;
`;

const TableCol = styled.div`
  max-width: 200px; /* Giới hạn chiều rộng */
  overflow: hidden; /* Ẩn nội dung tràn */
  text-overflow: ellipsis; /* Thêm dấu "..." khi nội dung quá dài */
  white-space: nowrap; /* Không cho xuống dòng */
  padding: 0.5rem;
  padding-top: 0.25rem; /* 4px */
  padding-bottom: 0.25rem; /* 4px */
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 6 cột với kích thước đều nhau */
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  font-size: 0.875rem;
`;
const AdminBalanceWrapper = styled.div`
  margin: 1rem 0;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  display: flex;
  justify-content: right;
`;

const Transaction = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [adminBalance, setAdminBalance] = useState(0);

  const fetchTransactions = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/transaction?page=${page}&limit=${limit}`,
      );

      // Lưu dữ liệu vào state
      setTransactions(response.DT.transactions);
      setTotalPages(response.DT.pagination.totalPages);
      setCurrentPage(response.DT.pagination.currentPage);

      // Lấy số dư của admin
      setAdminBalance(response.DT.transactions[0].toAccountId.balance);

      console.log(transactions);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchTransactions(selectedPage);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <p className="mb-2">Transactions</p>

      {/* Admin Balance */}
      <AdminBalanceWrapper>
        <span>Admin Balance:</span>
        <span>{adminBalance} $</span>
      </AdminBalanceWrapper>

      <div className="flex flex-col gap-2 ">
        {/* List Table Title */}
        <TableRow>
          <TableCol>Order ID</TableCol>
          <TableCol>User Name</TableCol>
          <TableCol>Status</TableCol>
          <TableCol>Amount</TableCol>
          <TableCol>Date</TableCol>
        </TableRow>

        {/* Category List */}
        {transactions.map((item, index) => (
          <TransactionRow key={index}>
            <TableCol title={item.orderId}>{item.orderId}</TableCol>
            <TableCol>{item.fromAccountId.userName}</TableCol>
            <TableCol>{item.status}</TableCol>
            <TableCol>{item.amount} $</TableCol>
            <TableCol title={formatDate(item.updatedAt)}>
              {formatDate(item.updatedAt)}
            </TableCol>
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
