// ===================================
// MapNexus API Client
// ===================================

const API_BASE_URL = 'http://localhost:3000/api';

// ===================================
// Helper Functions
// ===================================

// Get token from localStorage
function getToken() {
    return localStorage.getItem('mapnexus_token');
}

// Set token to localStorage
function setToken(token) {
    localStorage.setItem('mapnexus_token', token);
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('mapnexus_token');
}

// Get user from localStorage
function getUser() {
    const userStr = localStorage.getItem('mapnexus_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Set user to localStorage
function setUser(user) {
    localStorage.setItem('mapnexus_user', JSON.stringify(user));
}

// Remove user from localStorage
function removeUser() {
    localStorage.removeItem('mapnexus_user');
}

// Check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Check membership level
function getMembershipLevel() {
    const user = getUser();
    return user ? user.membership_type : 'free';
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ===================================
// Authentication API
// ===================================

const AuthAPI = {
    // Register
    async register(userData) {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (data.success) {
            setToken(data.token);
            setUser(data.user);
        }
        
        return data;
    },
    
    // Login
    async login(email, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.success) {
            setToken(data.token);
            setUser(data.user);
        }
        
        return data;
    },
    
    // Logout
    logout() {
        removeToken();
        removeUser();
        window.location.href = '/login.html';
    },
    
    // Get current user
    async getMe() {
        return await apiRequest('/auth/me');
    },
    
    // Change password
    async changePassword(currentPassword, newPassword) {
        return await apiRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
    }
};

// ===================================
// Places API
// ===================================

const PlacesAPI = {
    // Get all places
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/places?${queryString}`);
    },
    
    // Get place by ID
    async getById(id) {
        return await apiRequest(`/places/${id}`);
    },
    
    // Get places by category
    async getByCategory(category, limit = 20) {
        return await apiRequest(`/places/category/${category}?limit=${limit}`);
    },
    
    // Get featured places
    async getFeatured() {
        return await apiRequest('/places/featured/list');
    },
    
    // Search places
    async search(keyword) {
        return await apiRequest(`/places?search=${encodeURIComponent(keyword)}`);
    }
};

// ===================================
// Check-ins API
// ===================================

const CheckinsAPI = {
    // Create check-in
    async create(checkinData) {
        return await apiRequest('/checkins', {
            method: 'POST',
            body: JSON.stringify(checkinData)
        });
    },
    
    // Get my check-ins
    async getMy(limit = 20, offset = 0) {
        return await apiRequest(`/checkins/my?limit=${limit}&offset=${offset}`);
    },
    
    // Get place check-ins
    async getByPlace(placeId, limit = 10) {
        return await apiRequest(`/checkins/place/${placeId}?limit=${limit}`);
    },
    
    // Delete check-in
    async delete(checkinId) {
        return await apiRequest(`/checkins/${checkinId}`, {
            method: 'DELETE'
        });
    }
};

// ===================================
// Reviews API
// ===================================

const ReviewsAPI = {
    // Create review
    async create(reviewData) {
        return await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },
    
    // Get place reviews
    async getByPlace(placeId, limit = 10, offset = 0) {
        return await apiRequest(`/reviews/place/${placeId}?limit=${limit}&offset=${offset}`);
    }
};

// ===================================
// Favorites API
// ===================================

const FavoritesAPI = {
    // Add favorite
    async add(placeId, category = 'general', notes = null) {
        return await apiRequest('/favorites', {
            method: 'POST',
            body: JSON.stringify({ place_id: placeId, category, notes })
        });
    },
    
    // Get all favorites
    async getAll() {
        return await apiRequest('/favorites');
    },
    
    // Remove favorite
    async remove(placeId) {
        return await apiRequest(`/favorites/${placeId}`, {
            method: 'DELETE'
        });
    }
};

// ===================================
// Subscriptions API
// ===================================

const SubscriptionsAPI = {
    // Get all plans
    async getPlans() {
        return await apiRequest('/subscriptions/plans');
    },
    
    // Subscribe to plan
    async subscribe(planId, paymentMethod) {
        return await apiRequest('/subscriptions/subscribe', {
            method: 'POST',
            body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
        });
    },
    
    // Get my subscription
    async getMy() {
        return await apiRequest('/subscriptions/my');
    },
    
    // Cancel subscription
    async cancel(subscriptionId, reason = null) {
        return await apiRequest('/subscriptions/cancel', {
            method: 'POST',
            body: JSON.stringify({ subscription_id: subscriptionId, reason })
        });
    },
    
    // Get premium features
    async getFeatures() {
        return await apiRequest('/subscriptions/features');
    }
};

// ===================================
// Payments API
// ===================================

const PaymentsAPI = {
    // Create payment
    async create(subscriptionId, paymentMethod, amount) {
        return await apiRequest('/payments/create', {
            method: 'POST',
            body: JSON.stringify({
                subscription_id: subscriptionId,
                payment_method: paymentMethod,
                amount: amount
            })
        });
    },
    
    // Confirm payment
    async confirm(transactionId, gatewayTransactionId, paymentProof = null) {
        return await apiRequest('/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({
                transaction_id: transactionId,
                gateway_transaction_id: gatewayTransactionId,
                payment_proof: paymentProof
            })
        });
    },
    
    // Get payment history
    async getHistory(limit = 20, offset = 0) {
        return await apiRequest(`/payments/history?limit=${limit}&offset=${offset}`);
    }
};

// ===================================
// Users API
// ===================================

const UsersAPI = {
    // Get profile
    async getProfile() {
        return await apiRequest('/users/profile');
    },
    
    // Update profile
    async updateProfile(profileData) {
        return await apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },
    
    // Get stats
    async getStats() {
        return await apiRequest('/users/stats');
    }
};

// ===================================
// Events API
// ===================================

const EventsAPI = {
    // Get all events
    async getAll(upcoming = true) {
        return await apiRequest(`/events?upcoming=${upcoming}`);
    },
    
    // Get event by ID
    async getById(id) {
        return await apiRequest(`/events/${id}`);
    }
};

// ===================================
// Weather API
// ===================================

const WeatherAPI = {
    // Get current weather
    async getCurrent() {
        return await apiRequest('/weather/current');
    },
    
    // Get forecast
    async getForecast() {
        return await apiRequest('/weather/forecast');
    }
};

// ===================================
// Traffic API
// ===================================

const TrafficAPI = {
    // Get current traffic
    async getCurrent() {
        return await apiRequest('/traffic/current');
    }
};

// ===================================
// Export APIs
// ===================================

window.MapNexusAPI = {
    Auth: AuthAPI,
    Places: PlacesAPI,
    Checkins: CheckinsAPI,
    Reviews: ReviewsAPI,
    Favorites: FavoritesAPI,
    Subscriptions: SubscriptionsAPI,
    Payments: PaymentsAPI,
    Users: UsersAPI,
    Events: EventsAPI,
    Weather: WeatherAPI,
    Traffic: TrafficAPI,
    
    // Helper functions
    isLoggedIn,
    getMembershipLevel,
    getUser,
    getToken
};
