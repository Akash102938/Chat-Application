// simple mocked API that simulates delays for OTP and AI replies
export const sendOtp = (phone) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production you'd never return the OTP; here it's for dev convenience.
      resolve({ success: true, otp: '123456' });
    }, 900);
  });
};

export const verifyOtp = (otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') {
        resolve({ success: true, token: 'mock-token', user: { name: 'Demo User' } });
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 700);
  });
};

export const aiReply = (userMessage) => {
  const delay = 600 + Math.random() * 1400;
  return new Promise((resolve) => {
    setTimeout(() => {
      // trivial echo + small variation for demonstration
      resolve(`Assistant: I heard "${userMessage}". Here's a simple reply.`);
    }, delay);
  });
};
