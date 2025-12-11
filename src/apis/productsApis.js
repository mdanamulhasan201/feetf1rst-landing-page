// import axiosClient from "../../lip/axiosClient";
import axiosClient from "../../lip/axiosClient";
import { cache } from 'react';

// create products admin
export const createProducts = async (productData) => {
    try {
        const formData = new FormData();
        
        // Basic product information
        formData.append('name', productData.productName);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.category);
        formData.append('Sub_Category', productData.subCategory);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer || '0');
        
        // Handle size and quantities
        const sizeData = productData.size.map(size => ({
            size: size,
            quantity: parseInt(productData.sizeQuantities[size]) || 0
        }));
        formData.append('size', JSON.stringify(sizeData));
        
        // Technical information
        formData.append('feetFirstFit', productData.feetFirstFit || '');
        formData.append('footLength', productData.footLength || '');
        formData.append('technicalData', productData.technicalData || '');
        formData.append('Company', productData.company || '');
        formData.append('gender', productData.gender);
        
        // Update the question data formatting
        const questionData = {
            category: productData.category,
            subCategory: productData.subCategory || null,
            answers: Object.entries(productData.selectedAnswers || {}).map(([questionKey, answerData]) => ({
                questionKey,
                answer: answerData.answer,
                question: answerData.question,
                isNested: answerData.isNested || false
            }))
        };
        
        formData.append('question', JSON.stringify(questionData));
        
        // Add characteristics
        formData.append('characteristics', JSON.stringify(productData.characteristics));

        // Handle color variants and images
        let imageIndex = 0;
        productData.colorVariants.forEach((variant, colorIndex) => {
            variant.images.forEach(img => {
                const fileExtension = img.file.name.split('.').pop();
                const uniqueFileName = `${Date.now()}_${colorIndex}_${imageIndex}.${fileExtension}`;
                const renamedFile = new File([img.file], uniqueFileName, {
                    type: img.file.type
                });
                formData.append('images', renamedFile);
                imageIndex++;
            });
        });

        // Prepare color data
        const colorsArray = productData.colorVariants.map((variant, colorIndex) => ({
            colorName: variant.colorName,
            colorCode: variant.colorCode,
            images: variant.images.map((_, imgIndex) => {
                const fileExtension = variant.images[imgIndex].file.name.split('.').pop();
                return `${Date.now()}_${colorIndex}_${imgIndex}.${fileExtension}`;
            })
        }));
        formData.append('colors', JSON.stringify(colorsArray));

        // Log formData for debugging
        for (let pair of formData.entries()) {
            // console.log(pair[0], pair[1]);
        }

        // Send the request
        const response = await axiosClient.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// admin get all product
export const getAllProduct = async ({
    search = '',
    page = 1,
    limit = 2
} = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (search?.trim()) queryParams.append('search', search.trim());
        queryParams.append('page', page);
        queryParams.append('limit', limit);

        const response = await axiosClient.get(`/products/query?${queryParams}`);

        // Transform the response to include color information
        const transformedProducts = response.data.products.map(product => ({
            ...product,
            // Parse size string to array if it's a string
            size: typeof product.size === 'string' ? JSON.parse(product.size) : product.size,
            // Get all unique colors
            allColors: product.colors.map(color => ({
                name: color.colorName,
                code: color.colorCode,
                mainImage: color.images[0]?.url || null
            }))
        }));

        return {
            products: transformedProducts,
            total: response.data.pagination?.total || 0,
            currentPage: response.data.pagination?.currentPage || page,
            totalPages: response.data.pagination?.totalPages || 1,
            itemsPerPage: response.data.pagination?.itemsPerPage || limit,
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false
        };
    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
        throw new Error(errorMessage);
    }
}
// update product admin
export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();

        // Basic product fields
        formData.append('name', productData.productName);
        formData.append('brand', productData.brand);
        formData.append('Category', productData.category);
        formData.append('Sub_Category', productData.subCategory);
        formData.append('typeOfShoes', productData.typeOfShoes);
        formData.append('productDesc', productData.productDesc);
        formData.append('price', productData.price);
        formData.append('availability', String(productData.availability));
        formData.append('offer', productData.offer || '0');

        // Handle size and quantities
        const sizeData = productData.size.map(size => ({
            size: size,
            quantity: parseInt(productData.sizeQuantities[size]) || 0
        }));
        formData.append('size', JSON.stringify(sizeData));

        // Technical information
        formData.append('feetFirstFit', productData.feetFirstFit || '');
        formData.append('footLength', productData.footLength || '');
        formData.append('technicalData', productData.technicalData || '');
        formData.append('Company', productData.company || '');
        formData.append('gender', productData.gender);

        // Update the question data formatting - Same as createProducts
        const questionData = {
            category: productData.category,
            subCategory: productData.subCategory || null,
            answers: Object.entries(productData.selectedAnswers || {}).map(([questionKey, answerData]) => ({
                questionKey: questionKey.replace('nested_', ''),
                answer: answerData.answer,
                question: answerData.question,
                isNested: answerData.isNested || questionKey.startsWith('nested_')
            }))
        };
        
        formData.append('question', JSON.stringify(questionData));
        
        // Add characteristics
        formData.append('characteristics', JSON.stringify(productData.characteristics));

        // Handle color variants and images
        let imageIndex = 0;
        const colorsArray = productData.colorVariants.map((variant, colorIndex) => {
            const colorData = {
                id: variant.id,
                colorName: variant.colorName,
                colorCode: variant.colorCode,
                images: []
            };

            // Handle existing images
            variant.images.forEach(img => {
                if (img.isExisting) {
                    colorData.images.push({
                        id: img.id,
                        url: img.url
                    });
                }
            });

            // Handle new images
            variant.images.forEach(img => {
                if (!img.isExisting && img.file instanceof File) {
                    const fileExtension = img.file.name.split('.').pop();
                    const uniqueFileName = `${Date.now()}_${colorIndex}_${imageIndex}.${fileExtension}`;
                    
                    const renamedFile = new File([img.file], uniqueFileName, {
                        type: img.file.type
                    });
                    
                    formData.append('images', renamedFile);
                    
                    colorData.images.push({
                        filename: uniqueFileName,
                        isNew: true
                    });
                    
                    imageIndex++;
                }
            });

            return colorData;
        });

        formData.append('colors', JSON.stringify(colorsArray));

        // Send the request
        const response = await axiosClient.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Update Error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to update product');
    }
};

// delete single image product admin
export const deleteSingleImage = async (productId, imageFilename) => {
    try {
        const response = await axiosClient.delete(`/products/${productId}/${imageFilename}`);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete image');
        }

        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete image');
    }
}
// delete product admin
export const deleteProduct = async (id) => {
    try {
        const response = await axiosClient.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || 'Failed to delete product');
    }
}
// Get all products with filters client site 
export const getAllProducts = cache(async (filters) => {
    try {
        const queryParams = new URLSearchParams();

        // Get question data from sessionStorage
        const storedUserData = sessionStorage.getItem('completeUserData');
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                const questionData = {
                    category: userData.categoryInfo.slug,
                    subCategory: userData.categoryInfo.subCategory?.slug || null,
                    answers: userData.questionsAndAnswers.map(qa => ({
                        questionKey: qa.questionId.toString(),
                        answer: qa.selectedOption.answer,
                        question: qa.question,
                        isNested: qa.isNested || false
                    }))
                };
                queryParams.append('question', JSON.stringify(questionData));
            } catch (error) {
                console.error('Error parsing stored question data:', error);
            }
        }
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value) && value.length > 0) {
                    if (key === 'size') {
                        const sizeObjects = value.map(size => ({
                            size: size.toString()
                        }));
                        queryParams.append('size', JSON.stringify(sizeObjects));
                    } else if (key === 'colors') {
                        value.forEach(color => {
                            queryParams.append('colorName[]', color);
                        });
                    } else if (key === 'typeOfShoes') {
                        value.sort().forEach(type => {
                            queryParams.append('typeOfShoes[]', type);
                        });
                    } else if (key === 'brand') {
                        // Ensure brand is properly added to query params
                        queryParams.append('brand', value);
                    }
                } else if (value) {
                    // Handle non-array values
                    if (key === 'brand' && typeof value === 'string' && value.trim()) {
                        queryParams.append('brand', value.trim());
                    } else {
                        queryParams.append(key, value);
                    }
                }
            }
        });

        const response = await axiosClient.get(`/products/query?${queryParams}`);

        if (!response.data.products || response.data.products.length === 0) {
            return {
                products: [],
                total: 0,
                currentPage: filters.page || 1,
                totalPages: 0,
                itemsPerPage: filters.limit || 10,
                hasNextPage: false,
                hasPreviousPage: false
            };
        }

        // Transform the products
        const transformedProducts = response.data.products.map(product => {
            // Parse size data
            let parsedSize = [];
            try {
                if (typeof product.size === 'string') {
                    parsedSize = JSON.parse(product.size);
                } else {
                    parsedSize = product.size;
                }
            } catch (error) {
                console.error('Error parsing size:', error);
                parsedSize = [];
            }

            return {
                ...product,
                size: parsedSize,
                colorVariants: product.colors.map(color => ({
                    name: color.colorName,
                    code: color.colorCode,
                    mainImage: color.images[0]?.url || null,
                    images: color.images.map(img => img.url)
                }))
            };
        });

        return {
            products: transformedProducts,
            total: response.data.pagination?.total || 0,
            currentPage: response.data.pagination?.currentPage || filters.page,
            totalPages: response.data.pagination?.totalPages || 1,
            itemsPerPage: response.data.pagination?.itemsPerPage || filters.limit,
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false
        };
    } catch (error) {
        console.error('API Error:', error);
        // Return a structured error response instead of throwing
        return {
            error: true,
            message: error.response?.data?.message || 'Error while querying products',
            products: [],
            total: 0,
            currentPage: filters.page || 1,
            totalPages: 0,
            itemsPerPage: filters.limit || 10,
            hasNextPage: false,
            hasPreviousPage: false
        };
    }
});
// get product by id admin
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        if (response.data && response.data.success && response.data.product) {
            const product = response.data.product;

            // Helper function to format gender
            const formatGender = (gender) => {
                if (!gender) return '';
                return gender.toLowerCase();
            };

            // Parse question data and answers
            let parsedQuestions = {};
            if (product.question) {
                try {
                    const questionData = typeof product.question === 'string' 
                        ? JSON.parse(product.question) 
                        : product.question;

                    // Parse answers array from the question data
                    if (questionData.answers && Array.isArray(questionData.answers)) {
                        parsedQuestions = questionData.answers.reduce((acc, answer) => {
                            const { questionKey, answer: answerValue, question, isNested } = answer;
                            
                            // Create the answer object in the expected format
                            const key = isNested ? `nested_${questionKey}` : questionKey;
                            acc[key] = {
                                value: isNested 
                                    ? `nested_${questionKey}_${answerValue}` 
                                    : `${questionKey}_${answerValue}`,
                                question: question,
                                answer: answerValue,
                                isNested: isNested
                            };
                            return acc;
                        }, {});
                    }
                } catch (error) {
                    console.error('Error parsing question data:', error);
                }
            }

            // Parse size data
            let sizeData = [];
            let sizeQuantities = {};
            try {
                const parsedSize = typeof product.size === 'string' 
                    ? JSON.parse(product.size) 
                    : product.size;

                if (Array.isArray(parsedSize)) {
                    if (parsedSize.length > 0 && typeof parsedSize[0] === 'object') {
                        sizeData = parsedSize.map(item => item.size);
                        sizeQuantities = parsedSize.reduce((acc, item) => ({
                            ...acc,
                            [item.size]: item.quantity
                        }), {});
                    } else {
                        sizeData = parsedSize;
                    }
                }
            } catch (error) {
                console.error('Error parsing size data:', error);
            }

            const transformedProduct = {
                ...product,
                productName: product.name,
                category: product.Category?.toLowerCase(),
                gender: formatGender(product.gender),
                subCategory: product.Sub_Category?.toLowerCase(),
                size: sizeData,
                sizeQuantities: sizeQuantities,
                selectedAnswers: parsedQuestions,
                characteristics: Array.isArray(product.characteristics) 
                    ? product.characteristics.map(c => c.id.toString())
                    : [],
                colorVariants: product.colors?.map(color => ({
                    id: color.id,
                    colorName: color.colorName,
                    colorCode: color.colorCode,
                    images: color.images.map(img => ({
                        id: img.id,
                        url: img.url,
                        preview: img.url,
                        isExisting: true,
                        file: null
                    }))
                })) || []
            };

            return transformedProduct;
        }
        throw new Error('Product not found');
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
}
export const getProductByIdclient = async (id) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        if (response?.data && response?.data?.success) {
            const product = response?.data?.product;
            const recommendedProducts = response?.data?.recommendedProducts || [];

            return {
                product: {
                    ...product,
                    size: Array.isArray(product?.size) ? product?.size :
                        typeof product?.size === 'string' ? JSON.parse(product?.size) : [],
                    colorVariants: product?.colors?.map(color => ({
                        id: color.id,
                        colorName: color.colorName,
                        colorCode: color.colorCode,
                        images: color?.images?.map(img => ({
                            id: img.id,
                            url: img.url,
                            preview: img.url,
                            name: `Image ${img.id}`,
                            isExisting: true,
                            file: null
                        }))
                    })) || []
                },
                recommendedProducts
            };
        }
        throw new Error('Product not found');
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
}

// get CHARACTERISTICS
export const getCharacteristics = async () => {
    const response = await axiosClient.get('/products/technical-icons');
    try {
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch characteristics');
    }
}

// Get all categories
export const getAllCategories = async () => {
    try {
        const response = await axiosClient.get('/questions/admin');
        if (response?.data && response?.data?.level === "category") {
            return {
                success: true,
                data: response?.data?.data
            };
        }
        throw new Error('Invalid category data format');
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
}

// Get subcategories by category slug
export const getSubCategories = async (categorySlug) => {
    try {
        const response = await axiosClient.get(`/questions/admin/${categorySlug}`);
        if (response.data) {
            if (!response?.data?.data || response?.data?.level !== "sub-categories") {
                return {
                    success: true,
                    data: []
                };
            }

            return {
                success: true,
                data: response?.data?.data
            };
        }

        return {
            success: true,
            data: []
        };
    } catch (error) {
        // console.log('Error fetching subcategories:', error);
        return {
            success: true,
            data: []
        };
    }
}

// Get questions by category/subcategory slug
export const getCategoryQuestions = async (categorySlug, subCategorySlug = null) => {
    try {
        const formattedCategorySlug = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
        let endpoint = `/questions/${formattedCategorySlug}`;

        if (subCategorySlug) {
            const formattedSubCategorySlug = subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1);
            endpoint = `/questions/${formattedCategorySlug}/${formattedSubCategorySlug}`;
        }
        const response = await axiosClient.get(endpoint);
        return {
            success: true,
            data: response.data.questions || [],
            nextQuestions: response.data.nextQuestions || null
        };
    } catch (error) {
        // console.error('Error fetching questions:', error);
        return {
            success: true,
            data: [],
            nextQuestions: null
        };
    }
}

