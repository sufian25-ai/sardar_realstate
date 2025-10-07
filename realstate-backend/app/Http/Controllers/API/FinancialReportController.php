<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FinancialReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FinancialReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = FinancialReport::with('generatedBy:id,name,email');

            // Filters
            if ($request->has('type')) {
                $query->where('report_type', $request->type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from')) {
                $query->where('date_from', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->where('date_to', '<=', $request->date_to);
            }

            // Only admin can view reports
            if ($request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $reports = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Financial reports fetched successfully',
                'data' => $reports,
            ]);
        } catch (\Exception $e) {
            Log::error('Financial Reports Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch financial reports',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'report_type' => 'required|in:revenue,expenses,profit_loss,property_performance,rental_income',
                'date_from' => 'required|date',
                'date_to' => 'required|date|after_or_equal:date_from',
                'parameters' => 'nullable|array',
                'filters' => 'nullable|array',
            ]);

            // Only admin can generate reports
            if ($request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated['generated_by'] = $request->user()->id;
            $validated['status'] = 'processing';

            $report = FinancialReport::create($validated);

            // Here you would typically dispatch a job to generate the report
            // For now, we'll simulate report generation
            $this->generateReportData($report);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Financial report generation started successfully',
                'data' => $report->load('generatedBy:id,name,email'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Financial Report Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create financial report',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $report = FinancialReport::with('generatedBy:id,name,email')->findOrFail($id);

            // Check access
            if (!$report->canAccess(request()->user())) {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Financial report fetched successfully',
                'data' => $report,
            ]);
        } catch (\Exception $e) {
            Log::error('Financial Report Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Financial report not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $report = FinancialReport::findOrFail($id);

            // Only admin can update
            if ($request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'sometimes|required|in:processing,completed,failed',
                'report_data' => 'sometimes|required|array',
                'summary' => 'sometimes|required|array',
                'notes' => 'nullable|string',
            ]);

            $report->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Financial report updated successfully',
                'data' => $report->load('generatedBy:id,name,email'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Financial Report Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update financial report',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $report = FinancialReport::findOrFail($id);

            // Only admin can delete
            if ($request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $report->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Financial report deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Financial Report Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete financial report',
            ], 500);
        }
    }

    /**
     * Generate report data (simplified implementation).
     */
    private function generateReportData(FinancialReport $report)
    {
        // This is a simplified implementation
        // In a real application, you would use jobs and complex queries

        $data = [];
        $summary = [];

        switch ($report->report_type) {
            case 'revenue':
                $data = [
                    'total_revenue' => 150000,
                    'monthly_breakdown' => [
                        '2024-01' => 12000,
                        '2024-02' => 15000,
                        // ... more data
                    ]
                ];
                $summary = [
                    'total' => 150000,
                    'average_monthly' => 12500,
                    'growth_rate' => 8.5
                ];
                break;

            case 'property_performance':
                $data = [
                    'properties' => [
                        ['id' => 1, 'occupancy_rate' => 95, 'revenue' => 25000],
                        ['id' => 2, 'occupancy_rate' => 88, 'revenue' => 18000],
                    ]
                ];
                $summary = [
                    'total_properties' => 2,
                    'average_occupancy' => 91.5,
                    'total_revenue' => 43000
                ];
                break;

            // Add more report types as needed
        }

        $report->update([
            'status' => 'completed',
            'report_data' => $data,
            'summary' => $summary,
        ]);
    }
}
