<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/villes', [ApiController::class, 'getVilles']);
Route::get('/hotels', [ApiController::class, 'getHotels']);
Route::get('/restaurants', [ApiController::class, 'getRestaurants']);
Route::get('/stades', [ApiController::class, 'getStades']);
Route::get('/lieu-places', [ApiController::class, 'getLieuPlaces']);
Route::get('/plan-tours', [ApiController::class, 'getPlanTours']);
Route::get('/plan-tours/{id}', [ApiController::class, 'showPlanTour']);
Route::get('/service-locals', [ApiController::class, 'getServiceLocals']);
Route::get('/transports', [ApiController::class, 'getTransports']);
Route::get('/urgence-phonens', [ApiController::class, 'getUrgencePhonens']);
Route::get('/souvenirs', [ApiController::class, 'getSouvenirs']);
Route::get('/chat-context', [ApiController::class, 'getChatContext']);
Route::get('/commentaires', [ApiController::class, 'getCommentaires']);
Route::post('/commentaires', [ApiController::class, 'storeCommentaire']);
Route::post('/reservation', [ApiController::class, 'sendReservation']);

Route::get('/my-plans', [ApiController::class, 'getMyPlans']);
Route::post('/my-plans', [ApiController::class, 'storeMyPlan']);
Route::delete('/my-plans/{id}', [ApiController::class, 'deleteMyPlan']);



Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Hotels CRUD
    Route::post('/hotels', [ApiController::class, 'storeHotel']);
    Route::put('/hotels/{id}', [ApiController::class, 'updateHotel']);
    Route::delete('/hotels/{id}', [ApiController::class, 'deleteHotel']);

    // Restaurants CRUD
    Route::post('/restaurants', [ApiController::class, 'storeRestaurant']);
    Route::put('/restaurants/{id}', [ApiController::class, 'updateRestaurant']);
    Route::delete('/restaurants/{id}', [ApiController::class, 'deleteRestaurant']);

    // Villes CRUD
    Route::post('/villes', [ApiController::class, 'storeVille']);
    Route::put('/villes/{id}', [ApiController::class, 'updateVille']);
    Route::delete('/villes/{id}', [ApiController::class, 'deleteVille']);

    // Stades CRUD
    Route::post('/stades', [ApiController::class, 'storeStade']);
    Route::put('/stades/{id}', [ApiController::class, 'updateStade']);
    Route::delete('/stades/{id}', [ApiController::class, 'deleteStade']);

    // LieuPlaces CRUD
    Route::post('/lieu-places', [ApiController::class, 'storeLieuPlace']);
    Route::put('/lieu-places/{id}', [ApiController::class, 'updateLieuPlace']);
    Route::delete('/lieu-places/{id}', [ApiController::class, 'deleteLieuPlace']);

    // PlanTours CRUD
    Route::post('/plan-tours', [ApiController::class, 'storePlanTour']);
    Route::put('/plan-tours/{id}', [ApiController::class, 'updatePlanTour']);
    Route::delete('/plan-tours/{id}', [ApiController::class, 'deletePlanTour']);

    // ServiceLocals CRUD
    Route::post('/service-locals', [ApiController::class, 'storeServiceLocal']);
    Route::put('/service-locals/{id}', [ApiController::class, 'updateServiceLocal']);
    Route::delete('/service-locals/{id}', [ApiController::class, 'deleteServiceLocal']);

    // Transports CRUD
    Route::post('/transports', [ApiController::class, 'storeTransport']);
    Route::put('/transports/{id}', [ApiController::class, 'updateTransport']);
    Route::delete('/transports/{id}', [ApiController::class, 'deleteTransport']);

    // UrgencePhonens CRUD
    Route::post('/urgence-phonens', [ApiController::class, 'storeUrgencePhonen']);
    Route::put('/urgence-phonens/{id}', [ApiController::class, 'updateUrgencePhonen']);
    Route::delete('/urgence-phonens/{id}', [ApiController::class, 'deleteUrgencePhonen']);

    // Souvenirs CRUD
    Route::post('/souvenirs', [ApiController::class, 'storeSouvenir']);
    Route::put('/souvenirs/{id}', [ApiController::class, 'updateSouvenir']);
    Route::delete('/souvenirs/{id}', [ApiController::class, 'deleteSouvenir']);

    // Users CRUD
    Route::get('/users', [ApiController::class, 'getUsers']);
    Route::post('/users', [ApiController::class, 'storeUser']);
    Route::put('/users/{id}', [ApiController::class, 'updateUser']);
    Route::delete('/users/{id}', [ApiController::class, 'deleteUser']);

    // Commentaires Delete
    Route::delete('/commentaires/{id}', [ApiController::class, 'deleteCommentaire']);
});
