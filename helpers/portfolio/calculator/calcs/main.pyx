import numpy as np
cimport cython

def vol(double[:] returns, int precision):
    return round(np.std(returns), precision)

def cum_returns(double[:] returns):
    cdef float t1
    cdef Py_ssize_t x = returns.shape[0]
    result = np.zeros(x, dtype=np.single)
    cdef float[:] result_view = result
    cdef float tmp = 1.0
    for i in range(x):
        t1 = returns[i]
        tmp = tmp * (1.0+t1)
        result_view[i] = tmp
    return result

@cython.boundscheck(False)
@cython.cdivision(True)
def max_dd(double[:] returns, int precision):

    cdef float t1, t2
    cdef Py_ssize_t x = returns.shape[0]
    cdef double total_return
    cdef float maxdd = 0.0
    cdef float peak = 1.0
    cdef float trough = 1.0
    cdef float[:] total_returns = cum_returns(returns)

    for i in range(x):
        t1 = total_returns[i]
        if t1 > peak:
            peak = t1
            trough = peak
        elif t1 < trough:
            trough = t1
            t2 = (trough/peak)-1
            if (t2 < maxdd):
                maxdd = t2
    return round(maxdd * 100, precision)

def max_dd_threshold_position(double[:] returns, int precision, int threshold):

    """Finds every drawdown greater than the threshold.
    Drawdown is any period in which the asset drops
    by more than the threshold, until it surpasses the
    peak during that same period.

    If the asset is in a drawdown at the end of the period
    then we should return the last date.
    
    Returns the scale of the drawdown, and the start
    and end period of the drawdown.
    """

    res = []

    cdef Py_ssize_t x = returns.shape[0]
    if x == 0:
        return res
    cdef float[:] total_returns = cum_returns(returns) 

    result_buff_np = np.zeros(3, dtype=np.single)
    cdef float[:] result_buffer = result_buff_np

    cdef float peak = 1.0
    cdef float trough = 1.0
    cdef float t1, t2
    for i in range(x):

        """Four conditions:
        * We are at a new high coming out of a drawdown,
        therefore the drawdown has ended. We set the drawdown
        end position, and reset the buffer.
        * We are at a new high without a drawdown, we
        reset the start position of drawdown.
        * We are below the peak, but not below the threshold.
        * We are below the peak, and exceed the threshold.
        We record the size of the dd.
        """

        t1 = total_returns[i]
        if t1 > peak:
            if not result_buffer[2] == 0:
                result_buffer[1] = i
                res.append(result_buffer)
                result_buff_np = np.zeros(3, dtype=np.single)
                result_buffer = result_buff_np
                result_buffer[0] = i + 1
                peak = t1
                trough = peak
            else:
                result_buffer[0] = i + 1
        elif t1 < trough:
            trough = t1
            t2 = (trough/peak)-1
            if t2 < result_buffer[2] and t2 < threshold:
                result_buffer[2] = t2
    return np.asarray(res).tolist()

